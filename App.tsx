
import React, { useState, useMemo, useEffect } from 'react';
import { City } from './types';
import { INITIAL_CITIES, ALL_AVAILABLE_CITIES } from './constants';
import ClockCard from './components/ClockCard';
import WorldMapViz from './components/WorldMapViz';

type ThemeMode = 'auto' | 'light' | 'dark';

const App: React.FC = () => {
  const [selectedCities, setSelectedCities] = useState<City[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>('auto');
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');
  const [showShareToast, setShowShareToast] = useState(false);

  // 1. Initial Load: Persistence & Sharing & Geolocation
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sharedIds = params.get('cities')?.split(',');
    const savedIds = localStorage.getItem('global-clock-hubs')?.split(',');

    let initialList: City[] = [];

    // Prioritize Shared Link > LocalStorage > Default
    if (sharedIds && sharedIds.length > 0) {
      initialList = ALL_AVAILABLE_CITIES.filter(c => sharedIds.includes(c.id));
    } else if (savedIds && savedIds.length > 0) {
      initialList = ALL_AVAILABLE_CITIES.filter(c => savedIds.includes(c.id));
    }

    // Always ensure current local time is present if not already added
    const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const isLocalAlreadyAdded = initialList.some(c => c.timezone === localTimezone);

    if (!isLocalAlreadyAdded) {
      const matchingCity = ALL_AVAILABLE_CITIES.find(c => c.timezone === localTimezone);
      if (matchingCity) {
        initialList = [matchingCity, ...initialList];
      } else {
        const localCity: City = {
          id: 'local-node',
          name: 'Current Location',
          country: 'Detected',
          timezone: localTimezone,
          lat: 0,
          lng: 0
        };
        initialList = [localCity, ...initialList];
      }
    }

    setSelectedCities(initialList);
  }, []);

  // 2. Persist state to LocalStorage
  useEffect(() => {
    if (selectedCities.length > 0) {
      localStorage.setItem('global-clock-hubs', selectedCities.map(c => c.id).join(','));
    }
  }, [selectedCities]);

  // 3. Theme Logic
  useEffect(() => {
    if (themeMode === 'auto') {
      const hour = new Date().getHours();
      setCurrentTheme(hour >= 6 && hour < 18 ? 'light' : 'dark');
    } else {
      setCurrentTheme(themeMode as 'light' | 'dark');
    }
  }, [themeMode]);

  useEffect(() => {
    document.body.className = `theme-${currentTheme}`;
  }, [currentTheme]);

  const filteredCities = useMemo(() => {
    if (!searchQuery) return [];
    return ALL_AVAILABLE_CITIES.filter(city => 
      (city.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       city.country.toLowerCase().includes(searchQuery.toLowerCase())) &&
      !selectedCities.some(sc => sc.id === city.id)
    );
  }, [searchQuery, selectedCities]);

  const addCity = (city: City) => {
    setSelectedCities(prev => [...prev, city]);
    setSearchQuery('');
  };

  const removeCity = (id: string) => {
    setSelectedCities(prev => prev.filter(c => c.id !== id));
  };

  const toggleTheme = () => {
    const modes: ThemeMode[] = ['auto', 'light', 'dark'];
    const nextIndex = (modes.indexOf(themeMode) + 1) % modes.length;
    setThemeMode(modes[nextIndex]);
  };

  const shareDashboard = () => {
    const ids = selectedCities.map(c => c.id).join(',');
    const url = new URL(window.location.href);
    url.searchParams.set('cities', ids);
    navigator.clipboard.writeText(url.toString());
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 3000);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 pb-20`}>
      {/* Share Toast */}
      {showShareToast && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[60] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-3">
            <i className="fa-solid fa-check-circle"></i>
            Link Copied!
          </div>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
        <button 
          onClick={shareDashboard}
          className="w-14 h-14 rounded-full glass shadow-2xl flex items-center justify-center text-xl transition-transform hover:scale-110 active:scale-95 text-blue-500"
          title="Share Dashboard"
        >
          <i className="fa-solid fa-share-nodes"></i>
        </button>
        <button 
          onClick={toggleTheme}
          className="w-14 h-14 rounded-full glass shadow-2xl flex items-center justify-center text-xl transition-transform hover:scale-110 active:scale-95"
          title={`Theme: ${themeMode}`}
        >
          {themeMode === 'auto' && <i className="fa-solid fa-circle-half-stroke text-blue-500"></i>}
          {themeMode === 'light' && <i className="fa-solid fa-sun text-amber-500"></i>}
          {themeMode === 'dark' && <i className="fa-solid fa-moon text-indigo-400"></i>}
        </button>
      </div>

      <nav className="p-6 flex items-center justify-between max-w-7xl mx-auto relative z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <i className="fa-solid fa-globe text-white text-xl"></i>
          </div>
          <span className={`text-xl font-black tracking-tight ${currentTheme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Global Clock</span>
        </div>
        
        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className={`relative flex items-center glass rounded-2xl px-4 py-2 border transition-all ${isSearchFocused ? 'ring-2 ring-blue-500/20 border-blue-400' : 'border-black/5'}`}>
            <i className={`fa-solid fa-magnifying-glass text-xs ${currentTheme === 'dark' ? 'text-white/20' : 'text-slate-400'}`}></i>
            <input 
              type="text" 
              placeholder="Add another city..." 
              className="bg-transparent border-none focus:ring-0 w-full text-sm ml-3 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            />
            {filteredCities.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 glass-dark border border-black/5 rounded-2xl overflow-hidden shadow-2xl z-50">
                {filteredCities.slice(0, 5).map(city => (
                  <button key={city.id} onClick={() => addCity(city)} className="w-full flex items-center justify-between p-3 hover:bg-blue-500/10 transition-colors border-b border-black/5 last:border-0">
                    <span className="font-bold text-xs">{city.name}, {city.country}</span>
                    <span className="text-blue-500 text-[10px] mono">{city.timezone}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button onClick={shareDashboard} className={`px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${currentTheme === 'dark' ? 'border-white/10 text-white/40 hover:bg-white/5' : 'border-slate-200 text-slate-400 hover:bg-slate-50'}`}>
          <i className="fa-solid fa-share mr-2"></i> Share
        </button>
      </nav>

      <main className="relative pt-6 px-4 max-w-7xl mx-auto">
        {/* Decorative Background */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none -z-10 blur-[120px] opacity-20 transition-all duration-1000 ${currentTheme === 'dark' ? 'bg-indigo-500' : 'bg-blue-200'}`}></div>

        {/* The Dashboard (Marquee Section) */}
        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {selectedCities.map(city => (
              <ClockCard key={city.id} city={city} onRemove={removeCity} />
            ))}
            
            <div 
              onClick={() => document.querySelector('input')?.focus()}
              className={`rounded-[2rem] p-10 border-2 border-dashed flex flex-col items-center justify-center transition-all cursor-pointer min-h-[300px] group ${currentTheme === 'dark' ? 'border-white/10 text-white/10 hover:border-white/20 hover:text-white/30' : 'border-slate-200 text-slate-300 hover:border-slate-300 hover:text-slate-400'}`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${currentTheme === 'dark' ? 'bg-white/5' : 'bg-slate-100'}`}>
                <i className="fa-solid fa-plus text-xl"></i>
              </div>
              <p className="font-bold uppercase tracking-[0.1em] text-[10px]">Add Location</p>
            </div>
          </div>
        </div>

        {/* Footer Map Visualization */}
        <div className="mt-20 opacity-80 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-3 mb-4">
            <i className="fa-solid fa-map-location-dot text-blue-500"></i>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Global Node Network</span>
          </div>
          <WorldMapViz cities={selectedCities} />
        </div>
      </main>

      {/* Mobile Search - Visible only on mobile */}
      <div className="md:hidden px-4 mb-8">
          <div className={`relative flex items-center glass rounded-2xl px-4 py-3 border transition-all ${isSearchFocused ? 'ring-2 ring-blue-500/20 border-blue-400' : 'border-black/5'}`}>
            <i className={`fa-solid fa-magnifying-glass text-sm ${currentTheme === 'dark' ? 'text-white/20' : 'text-slate-400'}`}></i>
            <input 
              type="text" 
              placeholder="Search cities..." 
              className="bg-transparent border-none focus:ring-0 w-full text-sm ml-3 outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            />
            {filteredCities.length > 0 && (
              <div className="absolute bottom-full left-0 right-0 mb-2 glass-dark border border-black/5 rounded-2xl overflow-hidden shadow-2xl z-50">
                {filteredCities.slice(0, 5).map(city => (
                  <button key={city.id} onClick={() => addCity(city)} className="w-full flex items-center justify-between p-4 hover:bg-blue-500/10 transition-colors border-b border-black/5 last:border-0">
                    <span className="font-bold text-sm">{city.name}</span>
                    <span className="text-blue-500 text-[10px] mono">{city.country}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
      </div>

      <footer className="mt-20 text-center opacity-30 text-[9px] font-black tracking-[0.3em] uppercase">
        <p>Global Clock Sync &bull; Scoreboard Display Mode &bull; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default App;
