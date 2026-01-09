
export interface City {
  id: string;
  name: string;
  country: string;
  timezone: string;
  lat: number;
  lng: number;
}

export interface CityInsight {
  summary: string;
  cultureTip: string;
  currentVibe: string;
}

export interface TimeState {
  cityId: string;
  time: string;
  date: string;
  isDay: boolean;
  offset: string;
}
