
import { City } from './types';

export const INITIAL_CITIES: City[] = [
  { id: 'seoul', name: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul', lat: 37.5665, lng: 126.9780 },
  { id: 'newyork', name: 'New York', country: 'USA', timezone: 'America/New_York', lat: 40.7128, lng: -74.0060 },
  { id: 'london', name: 'London', country: 'UK', timezone: 'Europe/London', lat: 51.5074, lng: -0.1278 },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo', lat: 35.6895, lng: 139.6917 },
  { id: 'paris', name: 'Paris', country: 'France', timezone: 'Europe/Paris', lat: 48.8566, lng: 2.3522 },
  { id: 'dubai', name: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai', lat: 25.2048, lng: 55.2708 },
  { id: 'sydney', name: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney', lat: -33.8688, lng: 151.2093 },
  { id: 'saopaulo', name: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo', lat: -23.5505, lng: -46.6333 },
];

export const ALL_AVAILABLE_CITIES: City[] = [
  ...INITIAL_CITIES,
  { id: 'berlin', name: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin', lat: 52.5200, lng: 13.4050 },
  { id: 'singapore', name: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore', lat: 1.3521, lng: 103.8198 },
  { id: 'losangeles', name: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles', lat: 34.0522, lng: -118.2437 },
  { id: 'mumbai', name: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata', lat: 19.0760, lng: 72.8777 },
  { id: 'cairo', name: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo', lat: 30.0444, lng: 31.2357 },
];
